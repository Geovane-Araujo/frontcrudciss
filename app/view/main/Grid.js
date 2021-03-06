
Ext.define('CissProcSel.view.main.Grid', {
  extend: 'Ext.grid.Panel',
  xtype: 'explorergrid',
  requires: [
      'CissProcSel.store.Store'
  ],
  store: {
      type: 'explorer'
  },
  route: '',
  loadmask: true,
  stateful: true,
  columns: [
    { text: 'ID',  dataIndex: 'id' },
      { text: 'Nome',  dataIndex: 'nome', flex: 1  },
      { text: 'Sobrenome', dataIndex: 'sobrenome'},
      { text: 'Email', dataIndex: 'email', flex: 1 },
      { text: 'Nis', dataIndex: 'nis'}
  ],
  dockedItems: [
    {
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        width: 360,
        displayInfo: true,
        displayMsg: '{0} - {1} de {2}',
        emptyMsg: "Não Há Dadaos"
    }
  ],
  listeners: {
      afterrender: function(e){
        dataDynamicGrid(e);
      },
      rowdblclick: function(e){
        var obj = e.grid.getSelectionModel().getSelection();
        var params = {
            win: Ext.getCmp('panel_principal1'),
            id: obj[0].data.id,
            saveFn: function(b){
                dataDynamicGrid(Ext.getCmp('grid_funcionario'));
            }
        }
        eval('load_'+e.grid.context)(params);
      }, 
  }
});


function dataDynamicGrid(e){
  var params = {
    route: e.route,
    paging: 1,
    filters: '',
    orders: 'Order by id desc'
  }

  e.setLoading(true);
  Ext.Ajax.request({
      url: sisUrlRoute+'dynamic',
      jsonData: JSON.stringify(params),

      success: function(response){
          var response = Ext.decode(response.responseText);
          if(response.ret === 'success'){
            var grid = e.getStore();
            e.setStore(response.obj.obj);
            e.getStore().reload();
          } else {
              alertError(response.motivo);
          }
          e.setLoading(false);
      },
      failure: function(err){
          alertError(err);
      }
  });
}

function deleteDynamicGrid(e,selections){

  Ext.Msg.show({
    title:'Processo Seletivo Ciss',
    msg: 'Tem certeza ue gostaria de excluir este(s) ('+ selections.length+') registros?',
    icon: Ext.Msg.QUESTION,
    buttons: Ext.Msg.YESNO,
    fn: function(btn){
      if(btn == 'yes'){

        var ids = '';
        selections.forEach(element => {
          ids += element.data.id + ',';
        });

        ids = ids.substring(0,(ids.length - 1));
        var params = {
          ids: ids,
          tablebase: e.tablebase
        }

        e.setLoading(true);
        Ext.Ajax.request({
            url: sisUrlRoute+'deleteregisters',
            jsonData: JSON.stringify(params),

            success: function(response){
                var response = Ext.decode(response.responseText);
                if(response.ret === 'success'){
                  dataDynamicGrid(Ext.getCmp('grid_funcionario'));
                } else {
                    alertError(response.motivo);
                }
                e.setLoading(false);
            },
            failure: function(err){
                alertError(err);
            }
        });

      } else {
        return false;
      }
    }
  });

}